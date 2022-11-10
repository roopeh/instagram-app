const getBase64 = async (file: File | Blob): Promise<string> => new Promise((resolve, reject) => {
  const fileReader = new FileReader();
  fileReader.readAsDataURL(file);
  fileReader.onload = () => resolve(fileReader.result as string);
  fileReader.onerror = reject;
});

export default getBase64;
