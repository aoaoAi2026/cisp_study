# -*- coding: utf-8 -*-
import os
filepath = r'e:\\internal_safe\\cisp1\\cisp\\public\\books_export\\books_export\\Linux安全加固实战\\ch05-系统服务加固.md'
print("File exists:", os.path.exists(filepath))
print("File size:", os.path.getsize(filepath))
