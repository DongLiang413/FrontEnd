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
OK_HTML = 'HTTP/1.1 200 OK{}' \
         'Content-Type: text/html, */*{}{}'.format(CRLF, CRLF, CRLF)
OK_CSS = 'HTTP/1.1 200 OK{}' \
         'Content-Type: text/css{}{}'.format(CRLF, CRLF, CRLF)
OK_PNG = 'HTTP/1.1 200 OK{}' \
         'Content-Type: image/*, */*{}{}'.format(CRLF, CRLF, CRLF)
OK_AUDIO = 'HTTP/1.1 200 OK{}' \
         'Content-Type: audio/*, */*{}{}'.format(CRLF, CRLF, CRLF)
FORBIDDEN = 'HTTP/1.1 403 FORBIDDEN{}Connection: close{}{}'.format(CRLF, CRLF, CRLF)
NOT_FOUND = 'HTTP/1.1 404 NOT FOUND{}Connection: close{}{}'.format(CRLF, CRLF, CRLF)
METHOD_NOT_ALLOWED = 'HTTP/1.1 405  METHOD NOT ALLOWED{}' \
                     'Allow: GET, HEAD{}Connection: close{}{}'.format(CRLF, CRLF, CRLF, CRLF)
METHOD_NOT_ACCEPTED = 'HTTP/1.1 406 NOT ACCEPTABLE{}Connection: close{}{}'.format(CRLF, CRLF, CRLF)
MOVED_PERMANENTLY = 'HTTP/1.1 301 MOVED PERMANENTLY{}' \
                    'Location:  https://twin-cities.umn.edu/{}Connection: close{}{}'.format(CRLF, CRLF, CRLF, CRLF)


def check_406(resource, target):
    if (target in resource) or ('*/*' in resource):
        return True
    else:
        return False


def find_accept(req):
    # line list
    for i in req:
        if i.split(':')[0] == 'Accept':
            return i


def get_contents(fname):
    with open(fname, 'r') as f:
        return f.read()


def check_perms(resource):
    """Returns True if resource has read permissions set on 'others'"""
    stmode = os.stat(resource).st_mode
    return (getattr(stat, 'S_IROTH') & stmode) > 0


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
            th = Thread(target=self.accept_request, args=(client, address))
            th.start()

        # here, we add a function belonging to the class to accept
        # and process a request

    def accept_request(self, client_sock, client_addr):
        print("accept request")
        data = client_sock.recv(BUFSIZE)
        req = data.decode('utf-8')  # returns a string
        self.process_request(req, client_sock)  # returns a string
        # once we get a response, we chop it into utf encoded bytes
        # and send it (like EchoClient)
        # clean up the connection to the client
        # but leave the server socket for receiving requests open
        client_sock.shutdown(1)
        client_sock.close()

    # added a method to process requests, only head is handled in this code
    def process_request(self, request, client_sock):
        print('######\nREQUEST:\n{}######'.format(request))  # get the list of
        linelist = request.strip().split(CRLF)
        reqline = linelist[0]
        rlwords = reqline.split()
        if len(rlwords) == 0:
            return ''

        if rlwords[0] == 'HEAD':
            resource = rlwords[1][1:]  # skip beginning /
            return self.head_request(resource, client_sock)
        elif rlwords[0] == 'GET':
            resource = rlwords[1][1:]   # skip beginning /
            accept = rlwords[1].split(".")[-1]
            check406 = find_accept(linelist)    # find the 'Accept:' line
            return self.get_request(resource, accept, check406, client_sock)
        elif rlwords[0] == 'POST':
            resource = linelist[-1]  # get the post body
            return self.post_request(resource, client_sock)
        else:
            return METHOD_NOT_ALLOWED

    def head_request(self, resource, client_sock):
        """Handles HEAD requests."""
        path = os.path.join('.', resource)  # look in directory where server is running
        if resource == 'umntc':
            ret = MOVED_PERMANENTLY
        elif not os.path.exists(resource):
            ret = NOT_FOUND
        elif not check_perms(resource):
            ret = FORBIDDEN
        else:
            ret = OK
        client_sock.send(bytes(ret, 'utf-8'))

    # to do a get request, read resource contents and append to ret value.
    # (you should check types of accept lines before doing so)
    def get_request(self, resource, accept, check406, client_sock):
        """Handles GET requests."""
        path = os.path.join('.', resource)  # look in directory where server is running
        if resource == 'umntc':
            ret = MOVED_PERMANENTLY
            client_sock.send(bytes(ret, 'utf-8'))

        if not os.path.exists(resource):
            ret = NOT_FOUND + get_contents('404.html')
            client_sock.send(bytes(ret, 'utf-8'))

        if not check_perms(resource):
            ret = FORBIDDEN + get_contents('403.html')
            client_sock.send(bytes(ret, 'utf-8'))

        else:
            if accept == 'html':
                target_file = open(resource, 'r')
                read_content = target_file.read()
                ret = OK_HTML + read_content
                client_sock.send(bytes(ret, 'utf-8'))
                target_file.close()
            elif accept == 'css':
                target_file = open(resource, 'r')
                read_content = target_file.read()
                ret = OK_CSS + read_content
                client_sock.send(bytes(ret, 'utf-8'))
                target_file.close()
            elif accept == 'png':
                ret = OK_PNG
                if not check_406(check406, 'image/'):
                    ret = METHOD_NOT_ACCEPTED
                    client_sock.send(bytes(ret, 'utf-8'))
                else:
                    target_file = open(resource, 'rb')  # rb used to read binary file
                    read_content = target_file.read()
                    client_sock.send(bytes(ret, 'utf-8') + read_content)
                    target_file.close()
            elif accept == 'mp3':
                ret = OK_AUDIO
                if not check_406(check406, 'audio/'):
                    ret = METHOD_NOT_ACCEPTED
                    client_sock.send(bytes(ret, 'utf-8'))
                else:
                    target_file = open(resource, 'rb')
                    read_content = target_file.read()
                    client_sock.send(bytes(ret, 'utf-8') + read_content)
                    target_file.close()
            else:
                print("=========NOTHING========")
        print('===========connection closed. GET===========')

    def post_request(self, resource, client_sock):
        nvTuple = resource.split('&')
        leng = len(nvTuple)
        empty = ""
        for i in nvTuple:
            temp = i.replace('%3A', ':')  # transfer into 'hour : min' style
            empty += "<tr>"
            data = temp.split('=')
            empty += '<td>' + data[0] + ': </td>'
            empty += '<td>' + data[1] + '</td> <br>'
        ret = OK_HTML + empty
        client_sock.send(bytes(ret, 'utf-8'))
        print('===========connection closed. POST===========')


def parse_args():
    parser = ArgumentParser()
    parser.add_argument('port', default=9001, type=int, nargs='?',
                        help='specify a port to operate on (default: 9001)')
    args = parser.parse_args()
    return ('localhost', args.port)


if __name__ == '__main__':
    (host, port) = parse_args()
    myServer(host, port)
