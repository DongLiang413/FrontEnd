#!/usr/bin/env python3

import socket
from argparse import ArgumentParser

BUFSIZE = 4096

class myClient:
  def __init__(self, host, port):
    print('connecting to port {}'.format(port))
    self.host = host
    self.port = port

    self.setup_socket()

    self.talk()

    self.sock.shutdown(1)
    self.sock.close()
    print('connection closed.')

  def setup_socket(self):
    self.sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    self.sock.connect((self.host, self.port))

  def talk(self):
    msg = input('')
    while msg:

      ret = msg.split()
      ret = ret[1][1:]
      ret  += "PUT"
      store = open(ret, 'r')
      res = store.read()
      res += ret
      self.sock.send(bytes(res, 'utf-8'))
      msg = input('')


def parse_args():
  parser = ArgumentParser()
  parser.add_argument('--host', type=str, default='localhost',
                      help='specify a host to operate on (default: localhost)')
  parser.add_argument('-p', '--port', type=int, default=9001,
                      help='specify a port to operate on (default: 9001)')
  args = parser.parse_args()
  return (args.host, args.port)

if __name__ == '__main__':
  (host, port) = parse_args()
  myClient(host, port)
