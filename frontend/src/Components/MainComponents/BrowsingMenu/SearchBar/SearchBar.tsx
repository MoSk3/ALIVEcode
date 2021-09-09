import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Form, InputGroup } from 'react-bootstrap';
import { SearchBarProps } from './searchBarTypes';

const SearchBar = ({ value, setValue, onSubmit }: SearchBarProps) => {
	return (
		<InputGroup>
			<InputGroup.Text>
				<FontAwesomeIcon icon={faSearch} />
			</InputGroup.Text>
			<Form.Control
				value={value}
				onChange={e => setValue(e.target.value)}
				onBlur={(e: any) => {
					setValue(e.target.value);
					onSubmit && onSubmit(e.target.value);
				}}
				onKeyDown={(e: any) => {
					if (e.keyCode === 13) {
						setValue(e.target.value);
						onSubmit && onSubmit(e.target.value);
					}
				}}
				type="text"
			/>
		</InputGroup>
	);
};

export default SearchBar;