import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Link } from 'react-router-dom';

type ToolbarButtonProps = {
  icon: IconDefinition;
  onClick: () => void;
  link?: string;
  label?: string;
  className?: string;
  iconClass?: string;
  iconActive?: IconDefinition;
  active?: boolean;
  disabled?: boolean;
};

const ToolbarButton: React.FunctionComponent<ToolbarButtonProps> = ({
  icon,
  onClick,
  link,
  label,
  className,
  iconClass,
  iconActive,
  active,
  disabled,
}) => {

  const linkClassName = className ? `icon-container ${className}` : 'icon-container';
  const iconClassName = iconClass ? `icon ${iconClass}` : 'icon';

  const renderLinkContent = () => {
    return (
      <>
        {!disabled &&
          <FontAwesomeIcon
            icon={active && iconActive ? iconActive : icon}
            color="gray"
            className={iconClassName}
          />}
        {label && active && <span>{label}</span>}
        {/* <span>{label}</span> */}
      </>
    );
  }

  return link ?
    <Link to={link} className={linkClassName} onClick={onClick}>
      {renderLinkContent()}
    </Link>
    :
    <a className={linkClassName} onClick={onClick}>
      {renderLinkContent()}
    </a>;
}

export default ToolbarButton;