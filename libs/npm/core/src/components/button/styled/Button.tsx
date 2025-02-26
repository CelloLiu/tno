import styled from 'styled-components';

import { ButtonVariant, IButtonProps } from '..';

export const Button = styled.button<IButtonProps>`
  margin: 1px 2px 1px 2px;
  text-decoration: ${(props) => (props.variant === ButtonVariant.link ? 'underline' : 'none')};
  box-sizing: border-box;
  display: inline-block;
  font-weight: 400;
  text-align: center;
  vertical-align: middle;
  height: 40px;
  user-select: none;
  border: 2px solid transparent;
  padding: 0.375rem 0.75rem;
  font-size: 1rem;
  font-weight: 700;
  line-height: 1.6;
  border-radius: 0.25rem;
  transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out,
    border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  overflow: visible;
  text-transform: none;
  cursor: pointer;

  & > div {
    display: flex;
    flex-direction: row;
    white-space: nowrap;
  }

  &[disabled] {
    background-color: #f0f0f0;
    color: rgb(109, 109, 109);
    cursor: not-allowed;
  }

  color: ${(props) => {
    switch (props.variant) {
      case ButtonVariant.secondary:
        return '#003366';
      case ButtonVariant.link:
        return '#1a5a96';
      case ButtonVariant.action:
        return '#003366';
      case ButtonVariant.danger:
        return '#d93e45';
      default:
        return '#fff';
    }
  }};
  background-color: ${(props) => {
    switch (props.variant) {
      case ButtonVariant.primary:
        return '#003366';
      case ButtonVariant.success:
        return '#43893e';
      case ButtonVariant.info:
        return '#96c0e6';
      case ButtonVariant.warning:
        return '#f8bf2f';
      case ButtonVariant.secondary:
      case ButtonVariant.danger:
      case ButtonVariant.action:
      case ButtonVariant.link:
        return 'transparent';
      default:
        return '#003366';
    }
  }};
  border-color: ${(props) => {
    switch (props.variant) {
      case ButtonVariant.primary:
      case ButtonVariant.secondary:
        return '#003366';
      case ButtonVariant.success:
        return '#43893e';
      case ButtonVariant.info:
        return '#96c0e6';
      case ButtonVariant.warning:
        return '#f9ca54';
      case ButtonVariant.danger:
        return '#d93e45';
      case ButtonVariant.link:
        return 'transparent';
      case ButtonVariant.action:
        return '#003366';
      default:
        return '#003366';
    }
  }};

  &:hover:not([disabled]) {
    color: ${(props) => {
      switch (props.variant) {
        case ButtonVariant.secondary:
          return '#003366';
        case ButtonVariant.danger:
          return '#d93e45';
        case ButtonVariant.link:
          return '#0631f3';
        case ButtonVariant.action:
          return '#003366';
        case ButtonVariant.warning:
          return '#ffbb0e';
        default:
          return '#fff';
      }
    }};
    background-color: ${(props) => {
      switch (props.variant) {
        case ButtonVariant.primary:
          return '#2d476f';
        case ButtonVariant.secondary:
          return '#2d476f3b';
        case ButtonVariant.success:
          return '#366f32';
        case ButtonVariant.info:
          return '#77addf';
        case ButtonVariant.warning:
          return '#f9ca5478';
        case ButtonVariant.link:
          return 'transparent';
        case ButtonVariant.action:
        case ButtonVariant.danger:
          return '#ebe8e8';
        default:
          return '#fff';
      }
    }};
    border-color: ${(props) => {
      switch (props.variant) {
        case ButtonVariant.primary:
        case ButtonVariant.secondary:
          return '#294266';
        case ButtonVariant.success:
          return '#32662e';
        case ButtonVariant.info:
          return '#6da7dc';
        case ButtonVariant.warning:
          return '#f7bb23';
        case ButtonVariant.danger:
          return '#be262c';
        case ButtonVariant.link:
          return 'transparent';
        case ButtonVariant.action:
          return '#003366';
        default:
          return '#fff';
      }
    }};
  }

  &:focus {
    outline: 0;
    box-shadow: ${(props) => {
      switch (props.variant) {
        case ButtonVariant.primary:
          return '0 0 0 0.2rem rgb(86 114 156 / 50%)';
        case ButtonVariant.secondary:
          return '0 0 0 0.2rem rgb(130 138 145 / 50%)';
        case ButtonVariant.success:
          return '0 0 0 0.2rem rgb(95 155 91 / 50%)';
        case ButtonVariant.info:
          return '0 0 0 0.2rem rgb(132 169 202 / 50%)';
        case ButtonVariant.warning:
          return '0 0 0 0.2rem rgb(217 177 78 / 50%)';
        case ButtonVariant.danger:
          return '0 0 0 0.2rem rgb(223 91 97 / 50%)';
        case ButtonVariant.link:
          return '0 0 0 0.2rem rgb(56 89 138 / 50%)';
        default:
          return 'none';
      }
    }};
    color: ${(props) => {
      switch (props.variant) {
        case ButtonVariant.link:
          return '#0631f3';
      }
    }};
  }
`;
