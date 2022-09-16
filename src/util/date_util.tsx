import { default as dayjs } from "dayjs";
import isBetween from "dayjs/plugin/isBetween";

dayjs.extend(isBetween);

/**
 *
 * @return start_datetime_of_graph, end_datetime_of_graph
 */
const graph_start_end_datetime = (): [dayjs.Dayjs, dayjs.Dayjs] => {
  const today = dayjs();
  // when Monday is the first day of the week
  // the last day of this week
  const sunday_of_this_week = today.day(7);
  // the time range of graph
  const end_datetime_of_graph = sunday_of_this_week;
  const start_datetime_of_graph = sunday_of_this_week.subtract(83, "day");
  return [start_datetime_of_graph, end_datetime_of_graph];
};

type GraphPoint = {
  date: string;

  count: number;
};

export const graph = (
  date_times: string[],
  format: string
): [GraphPoint[], string[]] => {
  // get the graph start & end point
  const [start, end] = graph_start_end_datetime();
  const x_axis_titles = get_x_axis_titles(start);
  // count
  const graph_points: GraphPoint[] = [];
  for (let i = 0; i < 84; i++) {
    graph_points.push({
      date: start.add(i, "day").format("YYYY-MM-DD"),
      count: 0,
    });
  }
  for (let date_time of date_times) {
    const datetime_obj = dayjs(date_time, format);
    if (datetime_obj.isBetween(start, end, "day", "[]")) {
      const index = Math.ceil(datetime_obj.diff(start, "day", true));
      graph_points[index].count++;
    }
  }
  return [graph_points, x_axis_titles];
};

const get_x_axis_titles = (start: dayjs.Dayjs) => {
  const x_axis_titles: string[] = [];
  const titles = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  let day = start;
  for (let i = 0; i < 12; i++) {
    const day_puls_6 = day.add(6, "day");
    let first_day_of_month = day_puls_6.date(1);
    if (first_day_of_month.isBetween(day, day_puls_6, "day", "[]")) {
      x_axis_titles[i] = titles[day_puls_6.month()];
    } else {
      x_axis_titles[i] = "";
    }
    day = day.add(7, "day");
  }
  return x_axis_titles;
};

export type RenderGraphPoint = {
  date: string;

  count: number;

  color: string;
};

export const render = (graph_points: GraphPoint[]): RenderGraphPoint[] => {
  // 1, 2, 4, 8, 16+
  let colors = ["#E4C5FB", "#C789F8", "#B35FF5", "#983AE2", "#7531AC"];
  const graph: RenderGraphPoint[] = [];
  for (let i = 0; i < graph_points.length; i++) {
    const j = i % 12;
    const k = Math.floor(i / 12);
    const index = j * 7 + k;
    const element = graph_points[index].count;
    if (element == 0) {
      graph.push({
        date: graph_points[index].date,
        count: graph_points[index].count,
        color: "#EFEFEF",
      });
    } else {
      let color;
      if (element < 2) {
        color = 0;
      } else if (element < 4) {
        color = 1;
      } else if (element < 8) {
        color = 2;
      } else if (element < 16) {
        color = 3;
      } else {
        color = 4;
      }
      graph.push({
        date: graph_points[index].date,
        count: graph_points[index].count,
        color: colors[color],
      });
    }
  }
  return graph;
};
