import { styled } from 'goober'

export const Button = styled<'button', { active: number; background?: string; size?: number }>('button')`
  border-radius: 50%;

  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: ${(props) => props.size ?? 32}px;
  height: ${(props) => props.size ?? 32}px;

  box-shadow: none;
  border: ${(props) => (props.active === 1 ? '1px solid black' : '1px solid #e9e9e9')};
  padding: 5px;
  background: ${(props) => props.background ?? '#e9e9e9'};

  margin-left: 10px;
  position: relative;
  font-size: 20px;
  line-height: 20px;
`
