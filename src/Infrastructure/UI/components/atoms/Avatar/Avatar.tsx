import s from './Avatar.module.css';

export interface AvatarProps {
  src?: string;
  alt?: string;
  initials?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Avatar: React.FC<AvatarProps> = ({ src, alt = 'Avatar', initials, size = 'md' }) => {
  if (src) {
    return <img src={src} alt={alt} className={s.avatar} data-size={size} />;
  }
  return (
    <span className={s.avatar} data-size={size} aria-label={alt}>
      {initials}
    </span>
  );
};

export default Avatar;
