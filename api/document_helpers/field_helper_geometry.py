from api.classes.Geometry import Line, Box

from shapely.geometry import LineString


def filter_non_lines(cnts):
    filtered_cnts = []
    for cnt in cnts:
        if cnt.shape[0] == 2:
            filtered_cnts.append(cnt)
    return filtered_cnts


def detect_fillable_boxes(vertical_lines, horizontal_lines):
    box_list = []
    line_to_box = {}
    n = len(horizontal_lines)
    for i in range(n):
        for j in range(i+1, n):
            horizontal_l1 = LineString(
                horizontal_lines[i].retrieve_line_definition())
            horizontal_l2 = LineString(
                horizontal_lines[j].retrieve_line_definition())
            candidates = []
            for k in range(len(vertical_lines)):
                if len(candidates) > 1:
                    continue
                vertical_l = LineString(
                    vertical_lines[k].retrieve_line_definition())
                if vertical_l.intersects(horizontal_l1) and vertical_l.intersects(horizontal_l2):
                    candidates.append(vertical_lines[k])

            if len(candidates) > 1:
                candidates.append(horizontal_lines[i])
                candidates.append(horizontal_lines[j])
                for line in candidates:
                    line_to_box[line.retrieve_line_definition()
                                ] = len(box_list)
                box = Box(candidates[0], candidates[1],
                          candidates[2], candidates[3])
                box_list.append(box)

    return box_list, line_to_box


def define_line_objects(cnts):
    lines = []
    for cont in cnts:
        p1 = (int(cont[0][0][0]), int(cont[0][0][1]))
        p2 = (int(cont[1][0][0]), int(cont[1][0][1]))
        lines.append(Line(p1, p2))
    return lines


def find_closest(point, horizontal_lines):
    min_dist, best_line, best_x_diff = 10**9, None, 10**9
    for line in horizontal_lines:
        dist, x_diff = line.compute_distance_to_point(point)
        if dist < min_dist:
            min_dist = dist
            best_line = line
            best_x_diff = 10**9
        elif dist == min_dist and x_diff < best_x_diff:
            best_x_diff = x_diff
            best_line = line
    return best_line
