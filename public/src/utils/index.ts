export const isDate = (data: any) => {
  return data && !isNaN(data) && data instanceof Date;
};

export const isDev = () => {
  return process.env.NODE_ENV === "development";
};

export const download = (
  content: string,
  fileName: string,
  contentType: string,
  blob?: Blob
) => {
  const a = document.createElement("a");
  const file = blob || new Blob([content], { type: contentType });
  const url = URL.createObjectURL(file);
  a.href = url;
  a.download = fileName;
  a.click();
};

// download(jsonData, 'export.json', 'application/json');

export const copyToClipboard = (text: string) => {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.style.position = "fixed";
  textArea.style.opacity = "0";
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try {
    const successful = document.execCommand("copy");
    const msg = successful ? "successful" : "error";
    return msg;
  } catch (err) {
    return err;
  }
  document.body.removeChild(textArea);
};
