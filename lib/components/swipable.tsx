import { createContext, useContext, useRef } from 'react';
import { Animated, StyleSheet } from 'react-native';
import { Swipeable as RNSwipeable, RectButton } from 'react-native-gesture-handler';

const SwipeableContext = createContext<{
  ref: React.RefObject<RNSwipeable>;
  dragX: Animated.AnimatedInterpolation<string | number>;
  progress: Animated.AnimatedInterpolation<string | number>;
} | null>(null);

type RNSwipeableProps = React.ComponentProps<typeof RNSwipeable>;

interface SwipeableProps {
  left?: React.ReactNode;
  right?: React.ReactNode;
  onSwipeableOpen?: RNSwipeableProps['onSwipeableOpen'];
  onSwipeableClose?: RNSwipeableProps['onSwipeableClose'];
  children: React.ReactNode;
}

export function Swipeable({ left, right, children }: SwipeableProps) {
  const ref = useRef<RNSwipeable>(null);
  return (
    <RNSwipeable
      ref={ref}
      friction={2}
      leftThreshold={48}
      rightThreshold={48}
      enableTrackpadTwoFingerGesture
      renderLeftActions={
        left != null
          ? (progress, dragX) => (
              <SwipeableContext.Provider value={{ progress, dragX, ref }}>{left}</SwipeableContext.Provider>
            )
          : undefined
      }
      renderRightActions={
        right != null
          ? (progress, dragX) => (
              <SwipeableContext.Provider value={{ progress, dragX, ref }}>{right}</SwipeableContext.Provider>
            )
          : undefined
      }
    >
      {children}
    </RNSwipeable>
  );
}

Swipeable.Left = createActionButton('left', {
  inputRange: [0, 48],
  outputRange: [0, 1],
  extrapolate: 'clamp',
});
Swipeable.Right = createActionButton('right', {
  inputRange: [-48, 0],
  outputRange: [1, 0],
  extrapolate: 'clamp',
});

interface ActionButtonProps {
  onPress?: () => void;
  children: React.ReactNode;
}

function createActionButton(direction: 'left' | 'right', interpolation: Animated.InterpolationConfigType) {
  return function ActionButton({ onPress, children }: ActionButtonProps) {
    const ctx = useContext(SwipeableContext);
    if (ctx == null) throw new Error('No context available');
    const scale = ctx.dragX.interpolate(interpolation);

    return (
      <RectButton
        style={StyleSheet.compose(styles.action, styles[direction])}
        onPress={() => {
          ctx.ref.current?.close();
          if (onPress) onPress();
        }}
      >
        <Animated.View style={[styles.actionIcon, { transform: [{ scale }] }]}>{children}</Animated.View>
      </RectButton>
    );
  };
}

const styles = StyleSheet.create({
  action: {
    width: 48,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  left: {
    backgroundColor: '#388e3c',
    flexDirection: 'row-reverse',
  },
  right: {
    flexDirection: 'row',
    backgroundColor: '#dd2c00',
  },
  actionIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 24,
    height: 24,
    marginHorizontal: 12,
  },
});
