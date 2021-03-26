import cv2


def show_instafill_result(instafill_dict, pages_img):
    for page, fields in instafill_dict.items():
        img = pages_img[page-1]
        for field, content in fields.items():
            value = content['value']
            position = content['position']
            img = cv2.putText(img, value, position[0],
                              cv2.FONT_HERSHEY_SIMPLEX, 0.3, (0, 0, 255), 1)
        cv2.imshow("instafilled", img)
        cv2.waitKey(0)


def show_fillable_positions(fillable_positions, pages_img):
    for page, lines in fillable_positions.items():
        img = pages_img[page-1]
        for line in lines:
            img = cv2.line(img, line[0], line[1], (0, 255, 0), thickness=3)
        cv2.imshow("fillable_positions", img)
        cv2.waitKey(0)


dummy_data = {1: {'sex': {'value': 'M', 'position': ((451, 150), (429, 150))}, 'given name': {'value': 'Sheen Santos', 'position': ((207, 150), (429, 150))}, 'middle name': {'value': 'D.', 'position': ((331, 150), (429, 150))}, 'complete home address': {'value': 'Saint James Enterprises', 'position': ((108, 229), (185, 229))}, 'house no': {'value': 'Saint James Enterprises', 'position': ((108, 229), (185, 229))}, 'street': {'value': 'Carcar City', 'position': ((256, 229), (360, 229))}, 'towncity': {'value': 'Carcar City', 'position': ((108, 229), (185, 229))}, 'zip code': {'value': '6019', 'position': ((504, 229), (360, 229))}, 'cellphone no': {
    'value': '09957663043', 'position': ((81, 524), (577, 524))}, 'email address': {'value': 'sdcapadngan@cvisc.pshs.edu.ph', 'position': ((83, 542), (577, 542))}, 'school address': {'value': 'Saint James Enterprises', 'position': ((136, 367), (413, 367))}, 'home address if different from': {'value': 'Saint James Enterprises', 'position': ((118, 468), (577, 468))}, 'occupation': {'value': 'sdcapadngan@cvisc.pshs.edu.ph', 'position': ((72, 554), (577, 554))}, 'office address': {'value': 'Saint James Enterprises', 'position': ((86, 767), (577, 767))}, 'home address': {'value': 'Saint James Enterprises', 'position': ((81, 731), (577, 731))}}}

# show_instafill_result(dummy_data)
