from sentence_transformers import SentenceTransformer
from main_process import process_request
from api.document_helpers.pdf_helper import save_pdf_and_master
from flask import Flask, jsonify, request

app = Flask(__name__)

'''
app.model = SentenceTransformer(
    r'E:\PROJECTS\instafill_backend\api\instafill_text\model\field_model1')
'''


@app.route('/')
def main():
    return "FAK U SHEEN"


@app.route('/process', methods=["POST"])
def receive_request_from_client():

    uploaded_files = request.files
    print("UPLOADED FILES:", uploaded_files)

    pdf = uploaded_files['pdf'].read()
    master = uploaded_files['master'].read()

    '''
    pdf_uri, master_uri = save_pdf_and_master(pdf, master)
    json_result = process_request(pdf_uri, master_uri, app.model)
    print("JSON RESULT IS", json_result)
    '''
    return json_result


if __name__ == '__main__':
    app.debug = True
    app.run()
