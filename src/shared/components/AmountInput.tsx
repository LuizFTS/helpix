import React, { useEffect, useState } from 'react';
import { Input } from './Input';

type AmountInputProps = {
  label: string;
  value: number;
  onChangeValue: (value: number) => void;
  error?: string;
  placeholder?: string;
};

function formatFromNumber(value: number): string {
  if (!value) return '';
  return String(value).replace('.', ',');
}

/**
 * Campo de valor monetário com suporte real a decimais.
 *
 * Problema que isso resolve: se o texto exibido vier direto de
 * `String(numberValue)`, ao digitar "10," o parse imediato vira "10"
 * (a vírgula solta é descartada), e no próximo caractere você já
 * perdeu a parte decimal — nunca dá pra digitar "10,50" fluentemente.
 *
 * Solução: o texto exibido tem seu próprio estado local (exatamente o
 * que o usuário digitou), e só reportamos pra fora (`onChangeValue`) o
 * número já convertido. O texto só é resincronizado com o valor vindo
 * de fora (`value`) antes do primeiro foco — é assim que os dados
 * de uma transação existente aparecem preenchidos ao editar, sem
 * atrapalhar o que o usuário está digitando depois.
 */
export function AmountInput({ label, value, onChangeValue, error, placeholder = 'R$ 0,00' }: AmountInputProps) {
  const [text, setText] = useState(() => formatFromNumber(value));
  const [hasFocused, setHasFocused] = useState(false);

  useEffect(() => {
    if (!hasFocused) {
      setText(formatFromNumber(value));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const handleChangeText = (raw: string) => {
    const sanitized = raw.replace(/[^0-9,.]/g, '');
    setText(sanitized);

    const normalized = sanitized.replace(',', '.');
    const parsed = parseFloat(normalized);
    onChangeValue(Number.isFinite(parsed) ? parsed : 0);
  };

  return (
    <Input
      label={label}
      placeholder={placeholder}
      keyboardType="decimal-pad"
      value={text}
      onFocus={() => setHasFocused(true)}
      onChangeText={handleChangeText}
      error={error}
    />
  );
}
