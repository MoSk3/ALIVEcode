import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { LinkProps, StyledLinkProps } from './linkTypes';

const StyledLink = styled.a`
  color: ${(props: StyledLinkProps) => props.dark ? "var(--contrast-color)" :  "var(--pale-color)"};
  transition: 0.2s;
  cursor: pointer;
  font-weight: ${(props: StyledLinkProps) => props.bold ? "bold" : ""};
  display: ${(props: StyledLinkProps) => props.block ? "block" : "inline"};
`;

const Link = ({ to, children, style, dark, bold, block }: LinkProps) => {

  const history = useHistory();

  return <StyledLink dark={dark} block={block} bold={bold} style={style} onClick={() => history.push(to)}>{children}</StyledLink>
}

export default Link;