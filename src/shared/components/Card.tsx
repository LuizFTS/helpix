import React from 'react';
import { View, ViewProps } from 'react-native';
import { shadow } from '../../core/theme';

type CardProps = ViewProps & {
  elevated?: boolean;
  highlighted?: boolean;
  children: React.ReactNode;
};

export function Card({ elevated = false, highlighted = false, style, children, className, ...rest }: CardProps & { className?: string }) {
  return (
    <View
      style={[elevated ? shadow.card : undefined, style]}
      className={`rounded-md p-4 ${
        highlighted ? 'bg-surfaceHighlight border border-primary' : 'bg-surface'
      } ${className ?? ''}`}
      {...rest}
    >
      {children}
    </View>
  );
}
