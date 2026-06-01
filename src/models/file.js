// created_by handled by backend based on token
export const createFilePayload = (filename, project_uid) => {
  return {
    filename,
    project_uid,
    parent_file: null,
  };
};

export const isFilenameUnique = (filename, files) => {
  const normalized = filename.trim().toLowerCase();

  return !files.some((file) => file.filename.trim().toLowerCase() === normalized);
};

export const filterFilesByProject = (files, project_uid) => {
  return files.filter((file) => file.project_uid === project_uid);
};

export const filterFilesByOwner = (files, ownerEmail) => {
  return files.filter((file) => file.created_by === ownerEmail);
};

export const filterFilesByFID = (files, fid) => {
  // for loop instead of filter in hopes of early return
  for (let file of files) {
    if (file.uid == fid) {
      return file;
    }
  }
};

const LANGUAGES = {
  js: "javascript",
  jsx: "javascript",
  html: "html",
  htm: "html",
  css: "css",
  json: "json",
  yaml: "yaml",
  yml: "yaml",
  md: "markdown",
  py: "python",
  cs: "csharp",
  sql: "sql",
};

export const determineFileType = (filename) => {
  const nameArr = filename.split(".");
  if (nameArr.length < 2) return "folder";
  const extension = nameArr.at(-1);
  return LANGUAGES[extension] ?? extension;
};

export const determineFileExtension = (filename) => {
  const nameArr = filename.split(".");
  if (nameArr.length < 2) return "folder";
  return nameArr.at(-1);
};
