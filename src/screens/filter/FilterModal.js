import React from 'react';
import {Modal} from "semantic-ui-react";
import FilterScreen from "../../vastuscomponents/components/props/FilterScreen";

type Props = {
    open: boolean,
    onClose: () => void
};

/**
 * The modal that contains the search bar filtering controls.
 *
 * @param {Props} props The given props to the component.
 * @returns {*}
 * @constructor
 */
const FilterModal = (props: Props) => (
    <Modal size='huge' open={props.open} onClose={props.onClose} closeIcon>
        <FilterScreen/>
    </Modal>
);

export default FilterModal;