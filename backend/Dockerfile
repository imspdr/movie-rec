FROM python:3.10

WORKDIR /root
ADD requirements.txt /root
RUN cd
RUN pip install -r requirements.txt
ADD api /root/api
ADD main.py /root

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
