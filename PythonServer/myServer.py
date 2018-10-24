import socket
import os
import stat
import sys
import re
from datetime import datetime
from threading import Thread
from argparse import ArgumentParser

CRLF = '\r\n'
BUFSIZE = 4096

OK = 'HTTP/1.1 200 OK{}{}{}'.format(CRLF, CRLF, CRLF)
FORBIDDEN = 'HTTP/1.1 403 FORBIDDEN{}Connection: close{}{}'.format(CRLF, CRLF, CRLF)
NOT_FOUND = 'HTTP/1.1 404 NOT FOUND{}Connection: close{}{}'.format(CRLF, CRLF, CRLF)
METHOD_NOT_ALLOWED = 'HTTP/1.1 405  METHOD NOT ALLOWED{}' \
                     'Allow: GET, HEAD{}Connection: close{}{}'.format(CRLF, CRLF, CRLF, CRLF)

#move req 200 and 201
EXISTING_FILE = 'HTTP/1.1 200 Created{}Content-Location:/{}{}'.format(CRLF, CRLF, CRLF)
CREATED_FILE = 'HTTP/1.1 201 Created{}Content-Location:/{}{}'.format(CRLF, CRLF, CRLF)
MOVED_PERMANENTLY = 'HTTP/1.1 301 MOVED PERMANENTLY{}' \
                    'Location:  https://twin-cities.umn.edu/{}Connection: close{}{}'.format(CRLF, CRLF, CRLF, CRLF)

OPTION1 = 'HTTP/1.1 200 OK {} Allow:'.format(CRLF)
OPTION2 = '{}Cache-Control: max-age=604800{}'.format(CRLF, CRLF)


def get_contents(fname):
    with open(fname, 'r') as f:
      return f.read()


def check_perms(resource):
    """Returns True if resource has read permissions set on 'others'"""
    stmode = os.stat(resource).st_mode
    return (getattr(stat, 'S_IROTH') & stmode) > 0


def client_talk(client_sock, client_addr):
    print('Talking to {}'.format(client_addr))

    data = client_sock.recv(BUFSIZE)    # received data
    get_data = data.decode('utf-8')    # decode the received data

    string_list = get_data.split()
    request = string_list[0]

    print("###############" + get_data + "###############")
    print("!!!!!!!!!!!!" + string_list[0] + "!!!!!!!!!!!!")

    filename = string_list[1][1:]

    if request == 'GET':

        print(filename)
        if filename == 'umntc':
            ret = MOVED_PERMANENTLY
            client_sock.send(bytes(ret, 'utf-8'))

        if not os.path.exists(filename):
            ret = NOT_FOUND + get_contents('404.html')
            client_sock.send(bytes(ret, 'utf-8'))

        if not check_perms(filename):
            ret = FORBIDDEN + get_contents('403.html')
            client_sock.send(bytes(ret, 'utf-8'))

        else:
            target_file = open(filename, 'r')
            read_content = target_file.read()
            ret = 'HTTP/1.1 200 OK {}{}{}'.format('\r\n', '\r\n', '\r\n') + read_content
            client_sock.send(bytes(ret, 'utf-8'))

        target_file.close()
        # print(data.decode('utf-8'))
        print('connection closed. GET')

    # if stringA[0] == 'POST':
    #   if filename == 'umntc':
    #     ret = MOVED_PERMANENTLY
    #     client_sock.send(bytes(ret, 'utf-8'))
    #
    #   elif not os.path.exists(filename):
    #     htmlHead = "<html><head><meta charset='utf-8'><title>FormEX</title></head>"
    #     htmlEnd = "</table></body></html>"
    #     htmlTable = "<body><h1> THIS IS MY POST. Browser ‘s Display of Information sent in response to POST request</h1><table>"
    #     postData = stringA[-1]
    #     arrayA = postData.split('&')
    #     empty = ""
    #     for i in range(len(arrayA)):
    #       empty += "<tr>"
    #       rowCol = arrayA[i].split('=')
    #       empty += '<td>' + rowCol[0] + '</td>'
    #       empty += '<td>' + rowCol[1] + '</td>'
    #
    #     final = htmlHead + htmlTable + empty + htmlEnd
    #     final = final.replace("%3A", ":")
    #     final = final.replace("placename", "Place Name:")
    #     final = final.replace("addressline1", "Address Line 1:")
    #     final = final.replace("addressline2", "Address Line 2:")
    #     final = final.replace("opentime", "Open Time:")
    #     final = final.replace("closetime", "Close Time:")
    #     final = final.replace("additionalinfo", "Additional Info:")
    #
    #     writeFile = open("mypost.html", 'w')
    #     writeFile.write(final)
    #     writeFile.close()
    #     openFile = open("mypost.html", 'r')
    #     readData = openFile.read()
    #     myString = 'HTTP/1.1 200 OK {}{}{}'.format('\r\n', '\r\n', '\r\n') + readData
    #
    #     client_sock.send(bytes(myString, 'utf-8'))
    #     openFile.close()
    #     print('connection closed. POST')
    #   elif not check_perms(filename):
    #     ret = FORBIDDEN + get_contents('403.html')
    #     client_sock.send(bytes(ret, 'utf-8'))
    #   else:
    #     htmlHead = "<html><head><meta charset='utf-8'><title>FormEX</title></head>"
    #     htmlEnd = "</table></body></html>"
    #     htmlTable = "<body><h1> THIS IS MY POST. Browser ‘s Display of Information sent in response to POST request</h1><table>"
    #     postData = stringA[-1]
    #     arrayA = postData.split('&')
    #     empty = ""
    #     for i in range(len(arrayA)):
    #       empty += "<tr>"
    #       rowCol = arrayA[i].split('=')
    #       empty += '<td>' + rowCol[0] + '</td>'
    #       empty += '<td>' + rowCol[1] + '</td>'
    #
    #     final = htmlHead + htmlTable + empty + htmlEnd
    #     final = final.replace("%3A", ":")
    #     # final = final.replace("0", "")
    #     final = final.replace("placename", "Place Name:")
    #     final = final.replace("addressline1", "Address Line 1:")
    #     final = final.replace("addressline2", "Address Line 2:")
    #     final = final.replace("opentime", "Open Time:")
    #     final = final.replace("closetime", "Close Time:")
    #     final = final.replace("additionalinfo", "Additional Info:")
    #
    #     writeFile = open("mypost.html", 'w')
    #     writeFile.write(final)
    #     writeFile.close()
    #     openFile = open("mypost.html", 'r')
    #     readData = openFile.read()
    #     myString = 'HTTP/1.1 200 OK {}{}{}'.format('\r\n', '\r\n', '\r\n') + readData
    #
    #     client_sock.send(bytes(myString, 'utf-8'))
    #     openFile.close()
    #     print('connection closed. POST')
    #
    # if stringA[0] == 'DELETE':
    #   if filename == 'csumn':
    #     ret = MOVED_PERMANENTLY
    #     client_sock.send(bytes(ret, 'utf-8'))
    #   elif not os.path.exists(stringA[1][1:]):
    #     ret = NOT_FOUND + get_contents('404.html')
    #     client_sock.send(bytes(ret, 'utf-8'))
    #   else:
    #     os.remove(stringA[1][1:])
    #     print('HTTP/1.1 200 OK')
    #     print(str(datetime.now()))
    #     print('connection closed. DELETE')
    #
    # htmlHead = "<html><head><meta charset='utf-8'><title>FormEX</title></head>"
    # htmlEnd = "</body></html>"
    # htmlBody = "<body><h1> THIS IS MY PUT. </h1>"
    # postData = stringA[-1]
    # arrayA = postData.split(' ')
    # empty = ""
    # for i in range(len(arrayA)):
    #   empty += arrayA[i] + '\n'
    # final = htmlHead + htmlBody + empty + htmlEnd
    #
    # if stringA[0] == 'PUT':
    #   mystring = str(stringA[1])
    #   mystring = mystring.replace('/', '')
    #   if filename == 'csumn':
    #     ret = MOVED_PERMANENTLY
    #     client_sock.send(bytes(ret, 'utf-8'))
    #   elif not os.path.exists(mystring):
    #     writeFile = open(mystring, 'w')
    #     writeFile.write(final)
    #     writeFile.close()
    #     client_sock.send(bytes(CREATED_FILE, 'utf-8'))
    #   elif os.path.exists(mystring):
    #     fileOpen = open(mystring, "w")
    #     fileOpen.write(final)
    #     fileOpen.close()
    #     client_sock.send(bytes(EXISTING_FILE, 'utf-8'))
    #   if not check_perms(filename):
    #     ret = FORBIDDEN + get_contents('403.html')
    #     client_sock.send(bytes(ret, 'utf-8'))
    #
    # if stringA[0] == 'OPTIONS':
    #   OPTION1 = ''
    #   if stringA[1][1:] == '' or stringA[1][1:] == '*':
    #     OPTION1 += 'OPTIONS, GET, HEAD, POST, PUT, DELETE'
    #     OPTION1 += OPTION2 + str(datetime.now()) + '\r\n'
    #     OPTION1 += 'Content-Length:' + '0' + '\n'
    #     client_sock.send(bytes(OPTION1, 'utf-8'))
    #   elif stringA[1][1:] == 'form.html':
    #     OPTION1 += 'OPTIONS, GET, HEAD'
    #     OPTION1 += OPTION2 + str(datetime.now()) + '\r\n'
    #     OPTION1 += 'Content-Length:' + str(len(empty)) + '\n'
    #     client_sock.send(bytes(OPTION1, 'utf-8'))
    #   elif stringA[1][1:] == 'calendar.html':
    #     OPTION1 += 'OPTIONS, GET, HEAD'
    #     OPTION1 += OPTION2 + 'Date: ' + str(datetime.now()) + '\r\n'
    #     OPTION1 += 'Content-Length:' + str(len(empty)) + '\n'
    #     client_sock.send(bytes(OPTION1, 'utf-8'))
    #   else:
    #     client_sock.send(bytes(NOT_FOUND, 'utf-8'))

    client_sock.shutdown(1)
    client_sock.close()
    print('connection closed.')


class myServer:
    def __init__(self, host, port):
        print('Listening on port {}'.format(port))
        self.host = host
        self.port = port

        self.setup_socket()
        self.accept()

        self.sock.shutdown()
        self.sock.close()

    def setup_socket(self):
        self.sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        self.sock.bind((self.host, self.port))
        self.sock.listen(128)

    def accept(self):
        while True:
            (client, address) = self.sock.accept()
            th = Thread(target=client_talk, args=(client, address))
            th.start()

    def accept_request(self, client_sock):
        print("accept request")
        data = client_sock.recv(BUFSIZE)
        req = data.decode('utf-8')     # returns a string
        response=self.process_request(req)
        # once we get a response, we chop it into utf encoded bytes
        # and send it (like EchoClient)
        client_sock.send(bytes(response, 'utf-8'))

        # clean up the connection to the client
        # but leave the server socket for receiving requests open
        client_sock.shutdown(1)
        client_sock.close()

    def process_request(self, request):
        print('######\nREQUEST:\n{}######'.format(request))
        linelist = request.strip().split(CRLF)
        reqline = linelist[0]
        rlwords = reqline.split()
        if len(rlwords) == 0:
            return ''

        if rlwords[0] == 'HEAD':
            resource = rlwords[1][1:] # skip beginning /
            return self.head_request(resource)
        else:
            return METHOD_NOT_ALLOWED

    def head_request(self, resource):
        """Handles HEAD requests."""
        path = os.path.join('.', resource) #look in directory where server is running
        if resource == 'umntc':
            ret = MOVED_PERMANENTLY
        elif not os.path.exists(resource):
            ret = NOT_FOUND
        # elif not check_perms(resource):
        #     ret = FORBIDDEN
        else:
            ret = OK
        return ret


def parse_args():
    parser = ArgumentParser()
    # parser.add_argument('--host', type=str, default='localhost',
    #                     help='specify a host to operate on (default: localhost)')
    parser.add_argument('port', default=9001, type=int, nargs='?',
                        help='specify a port to operate on (default: 9001)')
    # parser.add_argument("port", help='specify a port to operate on (default: 9001)',
    #                     type=int)
    args = parser.parse_args()
    return ('localhost', args.port)


if __name__ == '__main__':
    (host, port) = parse_args()
    myServer(host, port)
