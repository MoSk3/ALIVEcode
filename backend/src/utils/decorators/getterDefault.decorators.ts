export const serialKey = "serialize"

export const GetterDefault: ({ defaultValue }: { defaultValue: string | number | boolean | Array<any> }) => PropertyDecorator =
  ({ defaultValue }) => {
    return function (target, propertyKey) {
      if (typeof propertyKey === 'string') {
        const newSym = Symbol(propertyKey);
        return {
          get: function (this: any) {
            const defaultVal = this[serialKey] && !this[newSym] && defaultValue;
            return defaultVal || this[newSym];
          },
          set: function (this: any, value: any) {
            this[newSym] = value;
          },
          enumerable: true,
          configurable: true,
          writeable: true,
        };
      }
    };
  };