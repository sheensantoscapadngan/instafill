import cv2


def show_instafill_result(instafill_dict):
    img = cv2.imread(
        "E:\PROJECTS\instafill_local\instafill\page_0.png", cv2.IMREAD_GRAYSCALE)
    for page, fields in instafill_dict.items():
        for field, content in fields.items():
            value = content['value']
            position = content['position']
            print("CONTENT IS", content)
            img = cv2.putText(img, value, position[0],
                              cv2.FONT_HERSHEY_SIMPLEX, 0.3, (0, 0, 255), 1)
        cv2.imshow("res", img)
        cv2.waitKey(0)


dummy_data = {1: {'NAME': {'value': 'Sheen Santos', 'position': ((55, 101), (460, 101))}, 'Last Name': {'value': 'Capadngan', 'position': ((55, 101), (460, 101))}, 'Given Name': {'value': 'Sheen Santos', 'position': ((55, 101), (460, 101))}, 'Middle Name': {'value': 'D.', 'position': ((55, 101), (460, 101))}, 'Mailing Address': {'value': 'Saint James Enterprises', 'position': (
    (92, 131), (587, 131))}, 'Permanent Address': {'value': 'Saint James Enterprises', 'position': ((108, 152), (586, 152))}, 'Mobile': {'value': '09957663043', 'position': ((233, 295), (335, 295))}, 'Email': {'value': 'sdcapadngan@cvisc.pshs.edu.ph', 'position': ((233, 295), (335, 295))}, 'Business or Office Address': {'value': 'Saint James Enterprises', 'position': ((137, 275), (589, 275))}}}

# show_instafill_result(dummy_data)
