import axios from 'axios';

type TypeLoadAllObj =  <T extends Object>(url: string, target: Function) => Promise<T[]>

export const loadAllObj: TypeLoadAllObj = async (url, target) => {
    const objects = (await axios.get(url)).data;

    return objects.map((obj: any) => {
        const tmpObj = Object.create(target.prototype)
        target.call(tmpObj, obj)
        return tmpObj;
    });
}