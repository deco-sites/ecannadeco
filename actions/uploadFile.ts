export interface PropsFormData {
  data: FormData;
  token?: string;
}

export interface PropsData {
  data: {
    files: {
      file: File;
    };
    category: string;
  };
  token?: string;
}

const uploadFile = async (
  { data }: PropsData,
  _req: Request,
): Promise<unknown | null> => {
  console.log({ dataBody: data });
  try {
    const response = await fetch("https://service.ecanna.com.br/files", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "multipart/form-data;",
        // Authorization: token,
      },
    });

    const res = await response.json();
    return res;
  } catch (e) {
    // console.log({ e });
    return e;
  }
};

export default uploadFile;
