import { API_URL } from "deco-sites/ecannadeco/sdk/constants.ts";

export interface Props {
  pin: string;
  token: string;
}

const updateUserData = async (
  props: Props,
  _req: Request,
): Promise<unknown | null> => {
  const { pin, token } = props;

  try {
    const responseUpdateProfile = await fetch(
      `${API_URL}/profile`,
      {
        method: "PUT",
        body: JSON.stringify({ pin }),
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      },
    );

    const resProfile = await responseUpdateProfile.json();

    console.log({ resProfile });

    return { resProfile };
  } catch (e) {
    console.log({ e });
    return e;
  }
};

export default updateUserData;
