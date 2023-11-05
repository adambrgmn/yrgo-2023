import Icon from '@expo/vector-icons/Feather';
import { Pressable } from 'react-native';

type IconProps = React.ComponentProps<typeof Icon>;

interface IconButtonProps {
  icon: IconProps['name'];
  size?: IconProps['size'];
  color?: IconProps['color'];
  label: string;
  onPress: () => void;
}

export function IconButton({ icon, size, color, label, onPress }: IconButtonProps) {
  return (
    <Pressable accessibilityLabel={label} onPress={onPress}>
      <Icon name={icon} size={size} color={color} />
    </Pressable>
  );
}
