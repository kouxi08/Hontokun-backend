export const answerToString = (ans: string | boolean): string => {
  if (typeof ans === 'boolean') {
    return ans ? 'true' : 'false';
  }
  return ans;
};

export const answerToBoolean = (ans: string | boolean): string | boolean => {
  if (ans === 'true') {
    return true;
  }
  if (ans === 'false') {
    return false;
  }
  return ans;
};
