/**
 * AvatarsIconsExample - Componente de ejemplo para Avatares e Iconos
 */
import React from 'react';
import Card from '../../../atoms/Card/Card';
import { Avatar } from '../../../atoms/Avatar/Avatar';
import { Icon } from '../../../atoms/Icon/Icon';
import { Text } from '../../../atoms/Text/Text';
import s from './AvatarsIconsExample.module.css';

export const AvatarsIconsExample: React.FC = () => (
  <Card title="Elements & Media" w={2} h={3}>
    <div className={s.container}>
      {/* Avatars Section */}
      <section className={s.section}>
        <Text size="xs" weight="bold" className={s.sectionTitle}>Avatars & Groups</Text>
        <div className={s.group}>
          <div className={s.stacked}>
            <Avatar size="sm" initials="JD" />
            <Avatar size="sm" initials="AS" />
            <Avatar size="sm" initials="UI" />
            <Avatar size="sm" initials="+5" />
          </div>
          <Avatar size="md" initials="MD" />
          <Avatar size="lg" initials="LG" />
        </div>
      </section>

      {/* Icons Section - Navigation */}
      <section className={s.section}>
        <Text size="xs" weight="bold" className={s.sectionTitle}>Navigation Icons</Text>
        <div className={s.group}>
          <div className={s.icon}><Icon name="Home" size={18} /></div>
          <div className={s.icon}><Icon name="Menu" size={18} /></div>
          <div className={s.icon}><Icon name="ArrowLeft" size={18} /></div>
          <div className={s.icon}><Icon name="ArrowRight" size={18} /></div>
          <div className={s.icon}><Icon name="ChevronLeft" size={18} /></div>
          <div className={s.icon}><Icon name="ChevronRight" size={18} /></div>
          <div className={s.icon}><Icon name="ChevronDown" size={18} /></div>
          <div className={s.icon}><Icon name="ChevronUp" size={18} /></div>
          <div className={s.icon}><Icon name="MoreVertical" size={18} /></div>
          <div className={s.icon}><Icon name="MoreHorizontal" size={18} /></div>
        </div>
      </section>

      {/* Icons Section - Actions */}
      <section className={s.section}>
        <Text size="xs" weight="bold" className={s.sectionTitle}>Action Icons</Text>
        <div className={s.group}>
          <div className={s.icon}><Icon name="Plus" size={18} /></div>
          <div className={s.icon}><Icon name="Edit" size={18} /></div>
          <div className={s.icon}><Icon name="Trash2" size={18} /></div>
          <div className={s.icon}><Icon name="Eye" size={18} /></div>
          <div className={s.icon}><Icon name="Save" size={18} /></div>
          <div className={s.icon}><Icon name="Search" size={18} /></div>
          <div className={s.icon}><Icon name="Filter" size={18} /></div>
          <div className={s.icon}><Icon name="RefreshCw" size={18} /></div>
          <div className={s.icon}><Icon name="Copy" size={18} /></div>
          <div className={s.icon}><Icon name="Download" size={18} /></div>
          <div className={s.icon}><Icon name="Upload" size={18} /></div>
          <div className={s.icon}><Icon name="Settings" size={18} /></div>
        </div>
      </section>

      {/* Icons Section - Finance & Stats */}
      <section className={s.section}>
        <Text size="xs" weight="bold" className={s.sectionTitle}>Finance & Stats Icons</Text>
        <div className={s.group}>
          <div className={s.icon}><Icon name="DollarSign" size={18} /></div>
          <div className={s.icon}><Icon name="TrendingUp" size={18} /></div>
          <div className={s.icon}><Icon name="TrendingDown" size={18} /></div>
          <div className={s.icon}><Icon name="BarChart" size={18} /></div>
          <div className={s.icon}><Icon name="PieChart" size={18} /></div>
          <div className={s.icon}><Icon name="LineChart" size={18} /></div>
          <div className={s.icon}><Icon name="Target" size={18} /></div>
          <div className={s.icon}><Icon name="Award" size={18} /></div>
        </div>
      </section>

      {/* Icons Section - Files & Folders */}
      <section className={s.section}>
        <Text size="xs" weight="bold" className={s.sectionTitle}>Files & Folders Icons</Text>
        <div className={s.group}>
          <div className={s.icon}><Icon name="Folder" size={18} /></div>
          <div className={s.icon}><Icon name="FolderPlus" size={18} /></div>
          <div className={s.icon}><Icon name="File" size={18} /></div>
          <div className={s.icon}><Icon name="FileText" size={18} /></div>
          <div className={s.icon}><Icon name="Archive" size={18} /></div>
          <div className={s.icon}><Icon name="Image" size={18} /></div>
          <div className={s.icon}><Icon name="Video" size={18} /></div>
          <div className={s.icon}><Icon name="Music" size={18} /></div>
        </div>
      </section>

      {/* Icons Section - User & Social */}
      <section className={s.section}>
        <Text size="xs" weight="bold" className={s.sectionTitle}>User & Social Icons</Text>
        <div className={s.group}>
          <div className={s.icon}><Icon name="User" size={18} /></div>
          <div className={s.icon}><Icon name="Users" size={18} /></div>
          <div className={s.icon}><Icon name="UserCheck" size={18} /></div>
          <div className={s.icon}><Icon name="LogOut" size={18} /></div>
          <div className={s.icon}><Icon name="Lock" size={18} /></div>
          <div className={s.icon}><Icon name="Unlock" size={18} /></div>
          <div className={s.icon}><Icon name="Heart" size={18} /></div>
          <div className={s.icon}><Icon name="Star" size={18} /></div>
          <div className={s.icon}><Icon name="Share2" size={18} /></div>
          <div className={s.icon}><Icon name="MessageSquare" size={18} /></div>
          <div className={s.icon}><Icon name="ThumbsUp" size={18} /></div>
          <div className={s.icon}><Icon name="ThumbsDown" size={18} /></div>
        </div>
      </section>

      {/* Icons Section - System */}
      <section className={s.section}>
        <Text size="xs" weight="bold" className={s.sectionTitle}>System Icons</Text>
        <div className={s.group}>
          <div className={s.icon}><Icon name="Clock" size={18} /></div>
          <div className={s.icon}><Icon name="Calendar" size={18} /></div>
          <div className={s.icon}><Icon name="AlertCircle" size={18} /></div>
          <div className={s.icon}><Icon name="Info" size={18} /></div>
          <div className={s.icon}><Icon name="Check" size={18} /></div>
          <div className={s.icon}><Icon name="X" size={18} /></div>
          <div className={s.icon}><Icon name="Loader" size={18} /></div>
          <div className={s.icon}><Icon name="Bell" size={18} /></div>
          <div className={s.icon}><Icon name="Mail" size={18} /></div>
          <div className={s.icon}><Icon name="Phone" size={18} /></div>
          <div className={s.icon}><Icon name="MapPin" size={18} /></div>
        </div>
      </section>

      {/* Icons Section - UI Elements */}
      <section className={s.section}>
        <Text size="xs" weight="bold" className={s.sectionTitle}>UI Elements Icons</Text>
        <div className={s.group}>
          <div className={s.icon}><Icon name="Grid" size={18} /></div>
          <div className={s.icon}><Icon name="List" size={18} /></div>
          <div className={s.icon}><Icon name="ToggleLeft" size={18} /></div>
          <div className={s.icon}><Icon name="ToggleRight" size={18} /></div>
          <div className={s.icon}><Icon name="Plus" size={18} /></div>
          <div className={s.icon}><Icon name="Minus" size={18} /></div>
          <div className={s.icon}><Icon name="Maximize" size={18} /></div>
          <div className={s.icon}><Icon name="Minimize" size={18} /></div>
          <div className={s.icon}><Icon name="ZoomIn" size={18} /></div>
          <div className={s.icon}><Icon name="ZoomOut" size={18} /></div>
        </div>
      </section>

      {/* Icons Section - Misc */}
      <section className={s.section}>
        <Text size="xs" weight="bold" className={s.sectionTitle}>Miscellaneous Icons</Text>
        <div className={s.group}>
          <div className={s.icon}><Icon name="Activity" size={18} /></div>
          <div className={s.icon}><Icon name="Zap" size={18} /></div>
          <div className={s.icon}><Icon name="Rocket" size={18} /></div>
          <div className={s.icon}><Icon name="Globe" size={18} /></div>
          <div className={s.icon}><Icon name="Cloud" size={18} /></div>
          <div className={s.icon}><Icon name="Wifi" size={18} /></div>
          <div className={s.icon}><Icon name="WifiOff" size={18} /></div>
          <div className={s.icon}><Icon name="Camera" size={18} /></div>
          <div className={s.icon}><Icon name="Printer" size={18} /></div>
          <div className={s.icon}><Icon name="Sun" size={18} /></div>
          <div className={s.icon}><Icon name="Moon" size={18} /></div>
        </div>
      </section>
    </div>
  </Card>
);

export default AvatarsIconsExample;
