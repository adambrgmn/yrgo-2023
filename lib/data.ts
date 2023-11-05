import AsyncStorage from '@react-native-async-storage/async-storage';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { nanoid } from 'nanoid/non-secure';
import { z } from 'zod';

const TODO_STORAGE_KEY = 'todos';
const TODOS_QUERY_KEY = ['todos'];

const TodoSchema = z.object({
  id: z.string(),
  title: z.string(),
  state: z.enum(['active', 'completed']),
  created: z.string().datetime(),
});

const TodoStorageSchema = z.object({ items: z.array(TodoSchema) });

export function useTodos() {
  const query = useQuery({ queryKey: TODOS_QUERY_KEY, queryFn: readTodos });

  const create = useTodoMutation<Omit<z.infer<typeof TodoSchema>, 'id' | 'created' | 'state'>>((todo, state) => {
    const id = nanoid();
    const created = new Date().toISOString();
    state.items.unshift({ ...todo, id, state: 'active', created });
    return state;
  });

  return { query, create };
}

export function useTodo(id: string) {
  const query = useQuery({
    queryKey: TODOS_QUERY_KEY,
    queryFn: readTodos,
    select(data) {
      return data.items.find((todo) => todo.id === id);
    },
  });

  const update = useTodoMutation<Partial<z.infer<typeof TodoSchema>>>((todo, state) => {
    for (let item of state.items) {
      if (item.id === id) {
        Object.assign(item, todo);
      }
    }

    return state;
  });

  const remove = useTodoMutation<void>((_, state) => {
    state.items = state.items.filter((todo) => todo.id !== id);
    return state;
  });

  return { query, update, remove };
}

type MutationFn<Input> = (input: Input, state: z.infer<typeof TodoStorageSchema>) => z.infer<typeof TodoStorageSchema>;

function useTodoMutation<Input>(fn: MutationFn<Input>) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: Input) => updateTodos((state) => fn(input, state)),
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: TODOS_QUERY_KEY });
    },
  });
}

async function readTodos() {
  const data = await AsyncStorage.getItem(TODO_STORAGE_KEY);
  return TodoStorageSchema.parse(JSON.parse(data ?? '{"items":[]}'));
}

async function updateTodos(fn: (state: z.infer<typeof TodoStorageSchema>) => z.infer<typeof TodoStorageSchema>) {
  const current = await readTodos();
  const next = fn(current);
  await AsyncStorage.setItem(TODO_STORAGE_KEY, JSON.stringify(next));
  return next;
}
