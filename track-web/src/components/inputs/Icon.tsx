import React from "react";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core"
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type IconProps = {
  icon: IconDefinition;
  onClick: () => void;
  path?: string;
  label?: string;
  className?: string;
  iconClass?: string;
  iconActive?: IconDefinition;
  active?: boolean;
  disabled?: boolean;
};

const Icon: React.FunctionComponent<IconProps> = ({
  icon,
  onClick,
  path,
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

  return path ?
    <Link to={path} className={linkClassName} onClick={onClick}>
      {renderLinkContent()}
    </Link>
    :
    <a className={linkClassName} onClick={onClick}>
      {renderLinkContent()}
    </a>;
}

export default Icon;