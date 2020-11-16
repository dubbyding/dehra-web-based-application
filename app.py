from flask import Flask, render_template, request, redirect, url_for

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/login', methods=('GET','POST'))
def login():
    if request.method == 'POST':
        username = request.form['Username']
        password = request.form['Password']
        if username=='Raj':
            return redirect(url_for('index'))
    return render_template('login.html')

@app.route('/signup')
def signup():
    return render_template('signup.html')

if __name__=='__main__':
    app.run(debug=True)