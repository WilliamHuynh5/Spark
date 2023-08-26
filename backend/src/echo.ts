/* This function isn't used by our project, this was simply our starting point to figure out how the API would work */

interface Echo {
  echo: string;
}

export const echo = async (str: string): Promise<Echo> => {
  return { echo: str };
};
