import React from 'react';

const Form = (props) => {
    return (
        <div class="container">
            <div class="row justify-content-center">
                <div class="col-md-8">
                    <div class="card">
                        <div class="card-header">{props.header}</div>

                        <div class="card-body">
                            <form onSubmit={event => props.handleSubmit(event)}>
                                    {props.children}

                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Form;