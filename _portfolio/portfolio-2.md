---
title: "GPU cloud computing with Paperspace"
excerpt: "This is a side-project that I developed because the limitation of training machine learning models in my local computer. As you may know, machine learning models often require a lot of computational power to run <br/><img src='/images/gradient_image_for_blog.png'>"
date: 1-2-2023
collection: portfolio
---

This is a side-project that I developed because the limitation of training machine learning models in my local computer. As you may know, machine learning models often require a lot of computational power to run. In particular, training models on GPUs can significantly speed up the process. However, not everyone has access to a powerful computer with a GPU. Some time ago, I discovered Paperspace.

Paperspace offers free GPU instances that you can use for machine learning tasks. Still, they mainly focus on Jupyter notebooks. This leaved missing the nice autocompletion features that you have in vscode, particularly since the lauch of PyLance. That's why I created a Docker image that takes care of all the. All you have to do is run the Docker image on your Paperspace instance, and you're good to go!

But that's not all. The Docker image also includes an R extension and Radian, which means you can run R and have full access to the terminal with nice autocompletion. This is perfect for those who love both R and Python.

The Docker image is built on top of the nvidia/cuda base image, which means it includes all the necessary dependencies for running TensorFlow and other machine learning libraries.

To use the Docker image, simply set this dockerfile as your image and choose the entrypoint.sh file as the entrypoint. This script takes care of starting the code-server and setting up the environment. When you get asked for the password, just copy the token from the URL.

![config view](/images/paperspace_config_blogpost.png)

With this Docker image, you can now take advantage of the free GPU instances on Paperspace and run machine learning models without worrying about the computational power of your laptop. Happy coding!

![sample view](/images/gradient_image_for_blog.png)

You can fork the repository and make your own varians to include your fav librares [here](https://github.com/phisanti/gradient-code-server)