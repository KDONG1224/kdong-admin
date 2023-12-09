export const addHyphen = (phoneNum: string) => {
  if (!phoneNum) return '';

  if (phoneNum.length === 8) {
    return phoneNum.replace(/^(\d{4})(\d{4})$/, `$1-$2`);
  }

  if (phoneNum.length === 10) {
    return phoneNum.replace(/^(\d{2})(\d{4})(\d{4})$/, `$1-$2-$3`);
  }

  return phoneNum.replace(/^(\d{2,3})(\d{3,4})(\d{4})$/, `$1-$2-$3`);
};

export const removeHyphen = (phoneNum: string) => {
  if (!phoneNum) return '';
  return phoneNum.replace(/-/g, '');
};
