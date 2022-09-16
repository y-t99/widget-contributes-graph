import React from "react";
import {
  FieldPicker,
  useSettingsButton,
  ViewPicker,
} from "@vikadata/widget-sdk";
import styles from "./setting.module.css";

interface ISettingProps {
  view_id: string,
  field_id: string,
  set_view_id: Function,
  set_field_id: Function
}

export const Setting: React.FC<ISettingProps> = (prop) => {
  const { view_id, field_id, set_view_id, set_field_id } = prop;
  const [isSettingOpened] = useSettingsButton();
  return isSettingOpened ? (
    <div className={styles.settingContent}>
      <div style={{ display: "flex", height: "100%" }}>
        <div style={{ flexGrow: 1, overflow: "auto" }}>
          <FormItem label="Selecting a view">
            <ViewPicker
              viewId={view_id}
              onChange={(option) => set_view_id(option.value)}
            />
          </FormItem>
          <FormItem label="Selecting a field containing datetime">
            <FieldPicker
              viewId={view_id}
              fieldId={field_id}
              onChange={(option) => set_field_id(option.value)}
            />
          </FormItem>
        </div>
      </div>
    </div>
  ) : null;
};

const FormItem = (props: IFormItemProps) => {
  const { label, children } = props;
  return (
    <div style={{ display: "flex", flexDirection: "column", marginBottom: 16 }}>
      <label className={styles.settingLabel}>{label} </label>
      {children}
    </div>
  );
};

interface IFormItemProps {
  label: string;
  children: any;
}
