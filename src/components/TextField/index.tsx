import React, { FC } from 'react';
import { FieldProps } from 'formik';
import { TextField as MaterialTextField } from '@material-ui/core';
import { TextFieldProps } from '@material-ui/core/TextField/TextField';

export const TextField: FC<FieldProps & TextFieldProps> = ({
	placeholder,
	field
}) => {
	return (
		<MaterialTextField variant="filled" placeholder={placeholder} {...field} />
	);
};
