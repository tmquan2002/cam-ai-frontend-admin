/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Grid,
  Group,
  Loader,
  NumberInput,
  PasswordInput,
  Radio,
  Select,
  TextInput,
} from "@mantine/core";

import { DateInput, DateTimePicker } from "@mantine/dates";

const renderTextField = ({ fieldProps }: any) => {
  const { form, name, placeholder, label, required, disabled, type, readonly } =
    fieldProps;
  return (
    <TextInput
      type={type}
      disabled={disabled}
      readOnly={readonly}
      withAsterisk={required}
      label={label}
      placeholder={placeholder}
      {...form.getInputProps(name)}
    />
  );
};
const renderPasswordInput = ({ fieldProps }: any) => {
  const { form, name, placeholder, label, required, disabled, readonly } =
    fieldProps;

  return (
    <PasswordInput
      disabled={disabled}
      readOnly={readonly}
      withAsterisk={required}
      label={label}
      placeholder={placeholder}
      {...form.getInputProps(name)}
    />
  );
};

const renderSelect = ({ fieldProps }: any) => {
  const {
    label,
    placeholder,
    data,
    form,
    name,
    disabled,
    searchable,
    loading,
    required,
    rightSection,
    readonly,
    rightSectionWidth,
  } = fieldProps;
  if (loading) return <Loader />;

  return (
    <Select
      searchable={searchable}
      label={label}
      disabled={disabled}
      readOnly={readonly}
      rightSectionWidth={rightSectionWidth}
      rightSectionPointerEvents="all"
      placeholder={placeholder}
      data={data}
      rightSection={rightSection}
      required={required}
      {...form.getInputProps(name)}
    />
  );
};

const renderRadio = ({ fieldProps }: any) => {
  const { name, label, description, form, data, required } = fieldProps;

  return (
    <Radio.Group
      name={name}
      label={label}
      required={required}
      description={description}
      {...form.getInputProps(name)}
    >
      <Group mt={"xs"}>
        {data.map(({ key, value }: { key: string; value: string }) => (
          <Radio key={key} value={key} label={value} />
        ))}
      </Group>
    </Radio.Group>
  );
};

const renderNumber = ({ fieldProps }: any) => {
  const { form, name, placeholder, label, required, disabled, readonly } =
    fieldProps;
  return (
    <NumberInput
      required={required}
      disabled={disabled}
      readOnly={readonly}
      withAsterisk={required}
      rightSection={<></>}
      label={label}
      name={name}
      placeholder={placeholder}
      {...form.getInputProps(name)}
    />
  );
};

const renderDate = ({ fieldProps }: any) => {
  const { form, name, placeholder, label, required, disabled, readonly } =
    fieldProps;
  return (
    <DateInput
      required={required}
      disabled={disabled}
      withAsterisk={required}
      label={label}
      readOnly={readonly}
      placeholder={placeholder}
      {...form.getInputProps(name)}
    />
  );
};

const renderDateTime = ({ fieldProps }: any) => {
  const { form, name, placeholder, label, required, disabled, readonly, withSeconds } =
    fieldProps;
  return (
    <DateTimePicker
      required={required}
      disabled={disabled}
      withAsterisk={required}
      label={label}
      readOnly={readonly}
      placeholder={placeholder}
      withSeconds={withSeconds}
      {...form.getInputProps(name)}
    />
  );
};

export const FIELD_TYPES = {
  TEXT: "text",
  SELECT: "select",
  RADIO: "radio",
  AUTOCOMPLETE: "autocomplete",
  UPLOAD: "upload",
  MULTILINE: "multiline",
  LARGE_MULTILINE: "large_multiline",
  NUMBER: "number",
  IMAGE_PICKER: "image_picker",
  MULTI_SELECT: "multi_select",
  DATE: "date",
  DATE_TIME: "date_time",
  PASSWORD_INPUT: "password_input",
};

const FORM_MAPPING = {
  [FIELD_TYPES.TEXT]: renderTextField,
  // [FIELD_TYPES.MULTILINE]: renderMultiline,
  [FIELD_TYPES.SELECT]: renderSelect,
  [FIELD_TYPES.RADIO]: renderRadio,
  [FIELD_TYPES.DATE]: renderDate,
  [FIELD_TYPES.DATE_TIME]: renderDateTime,
  //   [FIELD_TYPES.MULTI_SELECT]: renderMultiSelect,
  // [FIELD_TYPES.AUTOCOMPLETE]: renderAutoComplete,
  // [FIELD_TYPES.UPLOAD]: renderUpload,
  // [FIELD_TYPES.LARGE_MULTILINE]: renderLargeMultiline,
  [FIELD_TYPES.NUMBER]: renderNumber,
  //   [FIELD_TYPES.IMAGE_PICKER]: renderImagePicker,
  [FIELD_TYPES.PASSWORD_INPUT]: renderPasswordInput,
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomForm = ({ fields }: any) => {
  return (
    <Grid>
      {fields.map(({ type, fieldProps, spans, margin }: any, index: number) => {
        return (
          <Grid.Col span={spans ?? 12} key={index} m={margin ?? 0}>
            {FORM_MAPPING[type]({
              fieldProps: fieldProps,
            })}
          </Grid.Col>
        );
      })}
    </Grid>
  );
};

export default CustomForm;