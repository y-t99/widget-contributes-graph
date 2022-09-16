import React from "react";
import {
  Field,
  FieldType,
  IDateTimeFormat,
  useActiveViewId,
  useCloudStorage,
  useField,
  useFields,
  useRecords,
  useViewIds,
} from "@vikadata/widget-sdk";
import { Setting } from "./setting";
import { Box, Space } from "@vikadata/components";
import * as itou from "./util/date_util";
import { Tooltip } from "antd";
import { RenderGraphPoint } from "./util/date_util";

const check_filed_contains_data_time = (field: Field) => {
  return (
    field.type == FieldType.CreatedTime ||
    field.type == FieldType.DateTime ||
    field.type == FieldType.LastModifiedTime
  );
};

const useDefaultViewAndField = (): [string, string] => {
  // default: the active view id || the first view
  const default_view_id = useActiveViewId() || useViewIds()[0];
  // the datetime type;s fields
  const default_fields = useFields(default_view_id);
  const fields = default_fields.filter(check_filed_contains_data_time);
  // default: the first datetime type's field
  let default_field_id = "";
  if (fields.length > 0) {
    default_field_id = fields[0].id;
  }

  return [default_view_id, default_field_id];
};

type StorageResult = {
  view_id: string;
  set_view_id: Function;
  field_id: string;
  set_field_id: Function;
};

const useStoreViewAndField = (
  store_view_id: string,
  store_field_id: string
): StorageResult => {
  const [view_id, set_view_id] = useCloudStorage<string>(
    "view_id",
    store_view_id
  );
  const [field_id, set_field_id] = useCloudStorage<string>(
    "field_id",
    store_field_id
  );
  return {
    view_id,
    set_view_id,
    field_id,
    set_field_id,
  };
};

const useGraph = (view_id: string, field_id: string): [RenderGraphPoint[], string[]] => {
  const records = useRecords(view_id);
  let date_times: string[] = [];
  const field = useField(field_id);
  let format = "";
  if (field && check_filed_contains_data_time(field)) {
    for (let record of records) {
      const value = record.getCellValueString(field.id) as string;
      if (value) {
        date_times.push(value.split(" ")[0]);
      }
    }
    let field_property = field.property as IDateTimeFormat;
    format += field_property.dateFormat;
  }
  let [graph_element_count, x_axis_titles] = itou.graph(date_times, format);
  return [itou.render(graph_element_count), x_axis_titles];
};

export const ContributionsGraph: React.FC = () => {
  // get default view and field
  const [default_view_id, default_field_id] = useDefaultViewAndField();
  // store view id and field id
  const { view_id, set_view_id, field_id, set_field_id } = useStoreViewAndField(
    default_view_id,
    default_field_id
  );
  const [graph_points, x_axis_titles] = useGraph(view_id, field_id);
  return (
    <div style={{ display: "flex", height: "100%" }}>
      <div style={{ flexGrow: 1, overflow: "auto", paddingTop: "20px" }}>
        <Box display="flex" flexDirection="column">
          <Box
            bg="#fff"
            textAlign="center"
            padding="5px 11px"
            width="220px"
            margin="auto"
          >
            <Space size={[4, 4]} wrap>
              {new Array(84).fill(null).map((_, index) => (
                <Tooltip
                  title={
                    graph_points[index].count + " records on " + graph_points[index].date
                  }
                  overlayStyle={{
                    padding: "0px",
                    margin: "0px",
                    display: "float",
                  }}
                  overlayInnerStyle={{
                    padding: "0px",
                    margin: "0px",
                    fontSize: "10px",
                  }}
                >
                  <Box
                    key={index}
                    width="12px"
                    height="12px"
                    border={"1px solid " + graph_points[index].color}
                    bg={graph_points[index].color}
                    borderRadius="2px"
                    style={{ cursor: "pointer" }}
                  ></Box>
                </Tooltip>
              ))}
            </Space>
          </Box>
          <Box
            width="220px"
            minHeight="17px"
            lineHeight="17px"
            margin="auto"
            padding="0px 11px"
          >
            <Space size={[3, 0]} wrap>
              {new Array(12).fill(null).map((_, index) => (
                <Box
                  key={index}
                  width="13px"
                  height="13px"
                  style={{
                    fontSize: "12px",
                    fontFamily:
                      "DIN-Regular,PingFang SC,Helvetica,Arial,sans-serif",
                    color: "#9d9d9d",
                    cursor: "pointer",
                  }}
                >
                  {x_axis_titles[index]}
                </Box>
              ))}
            </Space>
          </Box>
        </Box>
      </div>
      <Setting
        view_id={view_id}
        field_id={field_id}
        set_view_id={set_view_id}
        set_field_id={set_field_id}
      />
    </div>
  );
};
