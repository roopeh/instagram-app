export type FormInput = {
  name: string,
  label: string,
  placeholder: string,
  initialValue: string,
  type: string,
};

export type FileInfo = {
  name: string,
  file: File,
};

export type ImageFile = {
  type: string,
  captionText: string,
  size: number,
  base64: string,
};
