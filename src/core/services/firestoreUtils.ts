/**
 * O Firestore rejeita qualquer campo com valor `undefined` em
 * `set()`/`addDoc()` (diferente de um objeto JS comum, onde isso é
 * normal). Como vários campos opcionais do nosso domínio (ex:
 * `installmentGroupId`, `notes`) legitimamente podem ser `undefined`,
 * usamos este helper antes de qualquer escrita — ele remove as chaves
 * `undefined` do objeto, deixando só o que tem valor de verdade.
 */
export function stripUndefined<T extends Record<string, unknown>>(data: T): Partial<T> {
  const result: Partial<T> = {};
  (Object.keys(data) as (keyof T)[]).forEach((key) => {
    if (data[key] !== undefined) {
      result[key] = data[key];
    }
  });
  return result;
}
