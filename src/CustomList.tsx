import React from "react";
import { v4 as uuidv4 } from "uuid";

import {
	Box,
	Checkbox,
	CircularProgress,
	IconButton,
	Snackbar,
	TextField,
	Typography,
} from "@material-ui/core";

import {
	ChevronLeft as ChevronLeftIcon,
	Link as LinkIcon,
} from "@material-ui/icons";

import { Alert } from "@material-ui/lab";

export default CustomList;

type CustomListProps = {
	code: string;
	onBack: () => void;
};

type CustomListItem = {
	id: string;
	code: string;
	value: string;
	done: boolean;
	order: number;
	editing: boolean;
};

function updateItem(item: CustomListItem) {
	window
		.fetch(`/items/update`, {
			method: "post",
			body: JSON.stringify(item),
			headers: { "Content-Type": "application/json" },
		})
		.catch((err) => console.log(err));
}

function removeItem(id: string) {
	window
		.fetch(`/items/remove`, {
			method: "post",
			body: JSON.stringify({ id: id }),
			headers: { "Content-Type": "application/json" },
		})
		.catch((err) => console.log(err));
}

export const CustomList: React.FC<CustomListProps> = ({
	code,
	onBack,
}: CustomListProps): JSX.Element => {
	const [newItemValue, setNewItemValue] = React.useState<string>("");
	const [items, setItems] = React.useState<CustomListItem[]>(undefined);
	const [linkInfoOpen, setLinkInfoOpen] = React.useState<boolean>(false);

	React.useEffect(() => {
		const interval = setInterval(() => {
			window
				.fetch(`/items/${code}`)
				.then((res) => res.json())
				.then((json) =>
					json.map((newItem: CustomListItem) => {
						const match = items
							? items.find((item: CustomListItem) => item.id === newItem.id)
							: undefined;
						return match && match.editing ? match : newItem;
					})
				)
				.then((items) => setItems(items))
				.catch((err) => console.log(err));
		}, 1000);
		return () => clearInterval(interval);
	}, [items]);

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
				if (newItem.id === id) {
					newItem.value = value;
					newItem.editing = true;
				}
				return newItem;
			})
		);
	};

	const handleItemBlur = (id: string, value: string): void => {
		if (value) {
			updateItem(items.find((item) => item.id === id));
			setItems(items.map((item) => ({ ...item, editing: false })));
		} else {
			setItems(items.filter((item) => item.id !== id));
			removeItem(id);
		}
	};

	const handleNewItem = (value: string): void => {
		if (value) {
			const newItem: CustomListItem = {
				id: uuidv4(),
				code: code,
				value: value,
				done: false,
				order: items.reduce(
					(order: number, item: CustomListItem) =>
						Math.max(order, item.order + 1),
					0
				),
				editing: false,
			};
			setItems([...items, newItem]);
			setNewItemValue("");
			updateItem(newItem);
		}
	};

	const handleLinkClick = () => {
		navigator.clipboard.writeText(`${document.domain}/list/${code}`);
		setLinkInfoOpen(true);
	};

	return (
		<>
			<Snackbar
				autoHideDuration={5000}
				onClose={() => setLinkInfoOpen(false)}
				open={linkInfoOpen}
			>
				<Alert severity="info">Link Copied!</Alert>
			</Snackbar>
			<Box
				display="flex"
				justifyContent="space-between"
				marginBottom={2}
				textAlign="center"
			>
				<IconButton onClick={onBack}>
					<ChevronLeftIcon />
				</IconButton>
				<Typography variant="h4">{code}</Typography>
				<IconButton onClick={handleLinkClick}>
					<LinkIcon />
				</IconButton>
			</Box>
			{items ? (
				<>
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
								onChange={(event) =>
									handleValueChange(item.id, event.target.value)
								}
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
						InputProps={{ endAdornment: <Box height="42px" /> }}
						onBlur={(event) => handleNewItem(event.target.value)}
						onChange={(event) => setNewItemValue(event.target.value)}
						onKeyPress={(event) =>
							event.key === "Enter" ? handleNewItem(newItemValue) : null
						}
						value={newItemValue}
					/>
				</>
			) : (
				<Box textAlign="center">
					<CircularProgress />
				</Box>
			)}
		</>
	);
};
