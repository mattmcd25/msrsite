import React from 'react';
import { injectTooltip } from 'react-md';

const styles = {
    tooltipContainer: {
        position: 'relative',
        display: 'inline-block',
    },
};

class Tooltip extends React.PureComponent {
    render() {
        const { children, tooltip } = this.props;
        return (
            <div style={styles.tooltipContainer}>
                {tooltip}
                {children}
            </div>
        );
    }
}

export default injectTooltip(Tooltip);