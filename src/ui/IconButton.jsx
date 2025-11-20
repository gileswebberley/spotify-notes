/**
 * Simply put an icon as the 'children'
 *
 * @typedef {Object} Props
 * @property {Function} clickHandler - the function to execute on click
 * @property {Boolean} disabledProp - defaults to false but can be passed to control the clickability, namely disable whilst submitting or the such
 * @property {Object} additionalStyles - pass a styles object as you would if you added the styles property to the button (use to override the class styles - 'icon-button')
 * @property {String} tooltipText - accessibility which will show as a tooltip and as an aria-description
 * @param {Props} props
 */
function IconButton({
  children,
  clickHandler,
  disabledProp = false,
  additionalStyles = {},
  tooltipText = '',
}) {
  return (
    <button
      className="icon-button"
      style={additionalStyles}
      disabled={disabledProp}
      onClick={clickHandler}
      title={tooltipText}
      aria-description={tooltipText}
    >
      {children}
    </button>
  );
}

export default IconButton;
