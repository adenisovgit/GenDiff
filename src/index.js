import { has } from 'lodash';
import { readFileSync, existsSync } from 'fs';

const genDiff = (fileName1, fileName2) => {
  // проверить на наличие файлов
  if (!existsSync(fileName1)) {
    return `${fileName1} отсутствует`;
  }
  if (!existsSync(fileName2)) {
    return `${fileName2} отсутствует`;
  }

  // загрузить содержимое файлов в объекты
  const json1 = JSON.parse(readFileSync(fileName1));
  const json2 = JSON.parse(readFileSync(fileName2));

  // объединяем ключи через множество, преобразуем в массив и идем по всем ключам
  const allKeys = [...new Set(Object.keys(Object.assign({}, json1, json2)))];

  const result = allKeys.reduce((acc, key) => {
    /* вывод для проверки вызова функции has. После решения вопроса с lodash удалю
    console.log('key: ', key);
    console.log('typeof(json1), typeof(json2): ', typeof json1, typeof json2);
    console.log(`json1[key], json2[key]: ${json1[key]}, ${json2[key]}`);
    console.log('has(json1, key), has(json2, key):', has(json1, key), has(json2, key));
    */
    if (json1[key] === json2[key]) {
      return `${acc}   ${key}: ${json1[key]}\n`;
    }
    if (has(json1, key) && has(json2, key)) {
      return `${acc} - ${key}: ${json1[key]}\n + ${key}: ${json2[key]}\n`;
    }
    if (has(json1, key)) {
      return `${acc} - ${key}: ${json1[key]}\n`;
    }
    return `${acc} + ${key}: ${json2[key]}\n`;
  }, '{\n');
  return `${result}}`;
};

export default genDiff;
