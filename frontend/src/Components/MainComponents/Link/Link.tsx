import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { LinkProps, StyledLinkProps } from './linkTypes';

const Link = ({ to, className, children, style, dark, bold, block, onClick }: LinkProps) => {

  const history = useHistory();

  return (
    <label
      className={className}
      style={style}
      onClick={() => {
        if (onClick) onClick();
        else if (to) history.push(to);
      }}>
      {children}
    </label>
  )
}

export default styled(Link)`
  color: ${(props: StyledLinkProps) => props.dark ? "var(--contrast-color)" : "var(--primary-color)"};
  transition: 0.2s;
  cursor: pointer;
  font-weight: ${(props: StyledLinkProps) => props.bold ? "bold" : ""};
  display: ${(props: StyledLinkProps) => props.block ? "block" : "inline"};

  &:hover {
    color: var(--primary-color);
    text-decoration-line: underline;
  }
`;