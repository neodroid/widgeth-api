import { apiGetERC20Tokens } from "../getETH";

const users = [
	{ id: 1, name: 'John Smith' },
	{ id: 2, name: 'Jane Doe' },
];

export default async (req, res) => {

  const { query: { id } } = req;

  const [eth, tokens] = await apiGetERC20Tokens(id);
  

  res.json({ 
    // ...users.find(user => user.id === parseInt(id)),
    ...eth,
    ...{tokens}

  });
}
