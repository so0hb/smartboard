import { SvgIcon } from "@/components/common";
import { t } from "@/locales";
import { FormRules, SelectOption } from "naive-ui";
import { VNodeChild } from "vue";

export function camelToSnake(obj: Record<string, any>): Record<string, any> {
  const snakeObj: Record<string, any> = {};

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const snakeKey = key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
      snakeObj[snakeKey] = obj[key];
    }
  }

  return snakeObj;
}
export  function snakeToCamel(obj: Record<string, any>): Record<string, any> {
  const camelObj: Record<string, any> = {};

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const camelKey = key.replace(/_([a-z])/g, (_, match) => match.toUpperCase());
      camelObj[camelKey] = obj[key];
    }
  }

  return camelObj as T;
}

export function getCurrentDate() {
  const date = new Date()
  const day = date.getDate()
  const month = date.getMonth() + 1
  const year = date.getFullYear()
  return `${year}-${month}-${day}`
}

export function extractUrlParams(url: string): Record<string, string> {
  const params = {};
  const urlParams = new URLSearchParams(url);
  urlParams.forEach((value, key) => {
    params[key] = value;
  });
  return params;
}

export function isEmailValid(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function generateValidationRules<T>(model: T, requiredFields: (keyof T)[]): FormRules {
  const rules: FormRules = {};

  requiredFields.forEach((field) => {
    rules[field as string] = [
      { required: true, message: t(`common.${field as string}Required`), trigger: ['input', 'blur'] },
    ];
  });

  return rules;
}



const renderLabelCountry: (option: SelectOption) => VNodeChild = (option) => {
  return h(
    'div',
    {
      style: {
        display: 'flex',
        alignItems: 'center',
      },
    },
    [
      h(SvgIcon, {
        icon: 'flagpack:' + (typeof option.value === 'string' ? option.value.toLowerCase() : option.value),
        class: 'w-6 h-6',
      }),
      h(
        'span',
        {
          style: {
            marginLeft: '8px',
          },
        },
        option.label as string,
      ),
    ],
  );
};