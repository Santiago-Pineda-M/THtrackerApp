import s from './Divider.module.css';

export interface DividerProps {
  vertical?: boolean;
  spacing?: 'sm' | 'md' | 'lg';
}

export const Divider: React.FC<DividerProps> = ({ vertical, spacing = 'md' }) => {
  return (
    <hr
      className={s.divider}
      data-vertical={vertical || undefined}
      data-spacing={spacing}
    />
  );
};

export default Divider;
