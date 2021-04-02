import React from "react";
import { v4 as uuidv4 } from "uuid";
import { Box, Checkbox, TextField, Typography } from "@material-ui/core";

export default CustomList;

type CustomListProps = {
	code: string;
};

type CustomListItem = {
	id: string;
	code: string;
	value: string;
	done: boolean;
};

function updateItem(item: CustomListItem) {
	window
		.fetch(`http://localhost:3000/items`, {
			method: "post",
			body: JSON.stringify(item),
			headers: { "Content-Type": "application/json" },
		})
		.catch((err) => console.log(err));
}

export const CustomList: React.FC<CustomListProps> = ({
	code,
}: CustomListProps): JSX.Element => {
	const [newItemValue, setNewItemValue] = React.useState<string>("");
	const [items, setItems] = React.useState<CustomListItem[]>([]);

	React.useEffect(() => {
		window
			.fetch(`http://localhost:3000/items/${code}`)
			.then((res) => res.json())
			.then((json) => setItems(json))
			.catch((err) => console.log(err));
	}, []);

	const handleToggleDone = (id: string): void => {
		const newItems = items.map((item) => {
			const newItem = { ...item };
			if (newItem.id === id) newItem.done = !newItem.done;
			return newItem;
		});
		setItems(newItems);
		updateItem(newItems.find((item) => item.id === id));
	};

	const handleValueChange = (id: string, value: string): void => {
		setItems(
			items.map((item) => {
				const newItem = { ...item };
				if (newItem.id === id) newItem.value = value;
				return newItem;
			})
		);
	};

	const handleItemBlur = (id: string, value: string): void => {
		if (!value) setItems(items.filter((item) => item.id !== id));
		else updateItem(items.find((item) => item.id === id));
	};

	const handleNewItem = (value: string): void => {
		if (value) {
			const newItem: CustomListItem = {
				id: uuidv4(),
				code: code,
				value: value,
				done: false,
			};
			setItems([...items, newItem]);
			setNewItemValue("");
			updateItem(newItem);
		}
	};

	return (
		<>
			<Box marginBottom={2} textAlign="center">
				<Typography variant="h4">{code}</Typography>
			</Box>
			{items.map((item: CustomListItem) => (
				<Box key={item.id} display="flex">
					<TextField
						fullWidth
						InputProps={{
							endAdornment: (
								<Checkbox
									checked={item.done}
									color="primary"
									onChange={() => handleToggleDone(item.id)}
								/>
							),
						}}
						onBlur={(event) => handleItemBlur(item.id, event.target.value)}
						onChange={(event) => handleValueChange(item.id, event.target.value)}
						onKeyPress={(event) =>
							event.key === "Enter"
								? (event.target as HTMLElement).blur()
								: null
						}
						value={item.value}
					/>
				</Box>
			))}
			<TextField
				fullWidth
				onBlur={(event) => handleNewItem(event.target.value)}
				onChange={(event) => setNewItemValue(event.target.value)}
				onKeyPress={(event) =>
					event.key === "Enter" ? handleNewItem(newItemValue) : null
				}
				value={newItemValue}
			/>
		</>
	);
};
