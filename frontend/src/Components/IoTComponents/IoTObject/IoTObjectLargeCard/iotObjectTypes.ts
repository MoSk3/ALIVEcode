import { IoTObject } from '../../../../Models/Iot/IoTobject.entity';
import styled from 'styled-components';
import { GenericCardProps } from '../../../UtilsComponents/Cards/GenericCard/genericCardTypes';

export interface IoTObjectLargeCardProps extends GenericCardProps {
	object: IoTObject;
}

export const StyledIoTObjectCard = styled.div``;