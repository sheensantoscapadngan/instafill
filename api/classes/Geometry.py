import math

SLOPE_THRESHOLD = 0.2


class Point:
    def __init__(self, coord):
        self.x = coord[0]
        self.y = coord[1]


class Line:
    def __init__(self, p1, p2):
        self.p1 = p1
        self.p2 = p2

    def retrieve_line_definition(self):
        return (self.p1, self.p2)

    def compute_distance_to_point(self, point):
        num = abs((self.p2[0]-self.p1[0])*(self.p1[1]-point.y) -
                  (self.p1[0]-point.x)*(self.p2[1]-self.p1[1]))
        denom = math.sqrt((self.p2[0]-self.p1[0]) **
                          2 + (self.p2[1]-self.p1[1])**2)
        dist = num/denom
        x_diff = min(abs(point.x-self.p1[0]), abs(point.x-self.p2[0]))
        return dist, x_diff

    def compute_slope(self):
        if self.p1[0] == self.p2[0]:
            return None
        return (self.p1[1]-self.p2[1])/(self.p1[0]-self.p2[0])


class Box:
    def __init__(self, l1, l2, l3, l4):
        self.l1 = l1
        self.l2 = l2
        self.l3 = l3
        self.l4 = l4

    def retrieve_bottom_line(self):
        lines = [self.l1, self.l2, self.l3, self.l4]
        bottom_line_def = ((0, 0), (0, 0))
        bottom_line = None
        for line in lines:
            line_def = line.retrieve_line_definition()
            if line.compute_slope() is None:
                continue
            slope = line.compute_slope()
            if slope < SLOPE_THRESHOLD and line_def[0][1] > bottom_line_def[0][1]:
                bottom_line = line
                bottom_line_def = line_def
        return bottom_line
