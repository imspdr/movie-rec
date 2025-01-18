FROM python:3.10

WORKDIR /root
ADD requirements.txt /root
RUN cd
RUN pip install -r requirements.txt
ADD model /root/model
ADD main.py /root

EXPOSE 8001

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8001"]
